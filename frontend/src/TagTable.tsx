import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import Button from "@mui/material/Button";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

import { TextField } from "@mui/material";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Link,
} from "react-router-dom";

interface Props {

}

const RENAME_TAG = gql`
  mutation renameTag($id: ID!, $name: String!) {
    renameTag(id: $id, name: $name) {
      tag {
        id
        tagName
      }
    }
  }
`;

const DELETE_TAG = gql`
  mutation deleteTag($id: ID!) {
    deleteTag(id: $id) {
      tag {
        tagName
      }
    }
  }
`;

const CREATE_TAG = gql`
  mutation createTag($name: String!) {
    createTag(name: $name) {
      tag {
        id
        tagName
      }
    }
  }
`;

interface TagType {
    id: number;
    tagName: string;
  }

const TAGS = gql`
  query {
  allTags {
    id
    tagName
  }
}
`

function Row(props: { row: TagType; refetch: any }) {
  const { row } = props;
  const [editing, setEditing] = React.useState(0);
  const [text, setText] = React.useState(row.tagName);
  const [title, setTitle] = React.useState(row.tagName);
  const [renameTag, { data, loading, error }] = useMutation(RENAME_TAG);
  const [deleteTag] = useMutation(DELETE_TAG);
  const icon_color = "#8f8f8f";
  const wrapperRef = React.useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const handleConfirm = () => {
    setTitle(text);
    renameTag({ variables: { id: row.id, name: text } });
    setEditing(0);
  };
  const handleEdit = () => {
    setEditing(1);
  };
  const handleDeletion = async () => {
    const data = await deleteTag({ variables: { id: row.id } });
    props.refetch();
  };

  return (
    <React.Fragment>
      <TableRow key={row.id}>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="left">
          {editing ? (
            <TextField onChange={handleChange} value={text} />
          ) : (
            title
          )}
        </TableCell>
        <TableCell align="right">
          {editing ? (
            <CheckIcon
              onClick={handleConfirm}
              style={{
                marginRight: "10px",
                color: icon_color,
                cursor: "pointer",
              }}
            />
          ) : (
            <CreateIcon
              onClick={handleEdit}
              style={{
                marginRight: "10px",
                color: icon_color,
                cursor: "pointer",
              }}
            />
          )}
          <DeleteIcon
            onClick={handleDeletion}
            style={{ color: icon_color, cursor: "pointer" }}
          />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

export default function TagTable(props: Props) {
  const [tagName, setTagName] = useState("");
  const { loading, error, data, refetch } = useQuery<{ allTags: TagType[] }>(TAGS);
  const [createTag] = useMutation(CREATE_TAG);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const handleCreation = async () => {
    try {
      await createTag({variables: { name: tagName }});
      refetch();
    } catch (error) {
      console.log("Duplicate entry!!")
    }
  }

  return (
    <Box margin={"10%"} marginTop={"150px"}>
      <Typography variant="h3" component="h2" marginBottom={"20px"}>
        Tag table
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Tag name</TableCell>
              <TableCell align="right">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.allTags.map((row: TagType, index: number) => (
              <Row key={row.id} row={row} refetch={refetch}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" flexDirection="column">
      <Typography variant="h5" marginTop={"40px"} marginBottom={"20px"}>
        Add new tag
      </Typography>
      <TextField onChange={handleChange} label={'Tag name'} style={{marginBottom: "10px", width: "200px"}} value={tagName} id="margin-none" />
      <Button onClick={handleCreation} style={{width: "80px"}} variant="contained">Save</Button>
      </Box>

    </Box>
  );
}

