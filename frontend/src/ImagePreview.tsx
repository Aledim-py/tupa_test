
import { useQuery, useMutation, gql } from "@apollo/client";
import {Box, Typography} from "@mui/material";
import {useLocation} from "react-router-dom";
import SelectTag from "./components/SelectTag";

interface ImageBare {
  image: {
    id: number;
    title: string;
    image: string;
  };
}

const IMAGE = gql`
  query image($image: String!) {
    image(image: $image) {
      id
      title
      image
    }
  }
`;

const domain = "http://127.0.0.1:8000";

function formLink(link?: string) {
  return domain + "/api/get-image/" + link;
}

export default function ImagePreview() {
  const location = useLocation();
  const splited = location.pathname.split("/");

  const { loading, error, data } = useQuery<ImageBare>(IMAGE, {
    variables: { image: "pic_storage/" + splited[splited.length - 1] },
  });

  return loading ? null : (
    <Box margin={"10%"} marginTop={"150px"}>
      <Typography variant="h3" component="h2" marginBottom={"20px"}>
        {data?.image.title}
      </Typography>

      {!loading ? (
        <img
          src={formLink(data?.image.image)}
          style={{ width: 800, height: 600 }}
        />
      ) : null}
      <SelectTag image_id={data!.image.id} />
    </Box>
  );
}

