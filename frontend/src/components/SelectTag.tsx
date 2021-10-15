import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {Button, Stack} from '@mui/material';
import { useQuery, useMutation, gql } from "@apollo/client";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface TagType {
    id: number;
    tagName: string;
}

const CONNECT_TAGS = gql`
  mutation connectTag($idImage: ID!, $idTag: [ID!]!) {
    connectTag(idImage: $idImage, idTag: $idTag) {
      success
    }
  }
`;

const GET_VACANT_TAGS = gql`
  query vacantTags($idImage: ID!) {
    vacantTags(idImage: $idImage) {
      id
      tagName
    }
  }
`;

const GET_CONNECTED_TAGS = gql`
  query imageTags($idImage: ID!) {
    imageTags(idImage: $idImage) {
      id
      tagName
    }
  }
`;

const REMOVE_TAG_CONNECTION = gql`
  mutation imageTags($idImage: ID!, $idTag: ID!) {
    removeTagConnection(idImage: $idImage, idTag: $idTag) {
      success
    }
  }
`;

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props: {image_id: number}) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<boolean>(false);
  const [connectTags] = useMutation(CONNECT_TAGS);
  const [removeConnection] = useMutation(REMOVE_TAG_CONNECTION);
  // Receiving data
  const selectTags = useQuery(GET_VACANT_TAGS, {
    variables: { idImage: props.image_id },
  });
  const connectedTags = useQuery(GET_CONNECTED_TAGS, {
    variables: { idImage: props.image_id },
  });


  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    if (value.length !== 0) setSelected(true);
    setPersonName(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleUpload = async () => {
    console.log("Handle uploading");
    const tag_id_list = [];
    for (let name of personName) {
      for (let tag of selectTags.data.vacantTags) {
        if (tag.tagName === name) tag_id_list.push(parseInt(tag.id));
      }
    }

    console.log(tag_id_list, props.image_id);

    if (!tag_id_list.length) return;

    setPersonName([]);
    await connectTags({
      variables: { idImage: props.image_id, idTag: tag_id_list },
    });
    selectTags.refetch();
    connectedTags.refetch();
  };

  const handleDelete =
    (chipToDelete: { id: number; tagName: string }) => async () => {
      // console.log(chipToDelete);
      await removeConnection({
        variables: { idImage: props.image_id, idTag: chipToDelete.id },
      });

      selectTags.refetch();
      connectedTags.refetch();
    };

  return connectedTags.loading || selectTags.loading ? null : (
    <Box display="flex" flexDirection="column">
      <Stack
        spacing={1}
        width="700px"
        direction="row"
        marginBottom={"20px"}
        marginTop={"10px"}
        flexWrap="wrap"
      >
        {connectedTags.data.imageTags.map(
          (tag: { id: number; tagName: string }, index: number) => {
            return <Chip key={tag.id} style={{ marginTop: "10px" }} label={tag.tagName} onDelete={handleDelete(tag)} />;
          }
        )}
      </Stack>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Available Tags</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Available Tags" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value, index) => (
                <Chip key={index} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {selectTags.data.vacantTags.map(
            (tag: { id: number; tagName: string }, index: number) => (
              <MenuItem
                key={tag.id}
                value={tag.tagName}
                style={getStyles(tag.tagName, personName, theme)}
              >
                {tag.tagName}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      {selected ? (
        <Button
          style={{ marginTop: "10px", width: "120px" }}
          variant="contained"
          type="button"
          onClick={handleUpload}
        >
          Save tags
        </Button>
      ) : null}
    </Box>
  );
}

