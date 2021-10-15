import React, { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useParams,
  Link,
} from "react-router-dom";
import ChooseFile from "./components/UploadFile";
import { createImage, getImages } from "./api/requests";
import { useQuery, useMutation, gql } from "@apollo/client";
import { TextField } from "@mui/material";
import ImagePreview from "./ImagePreview";

interface ImageType {
  id: number;
  title: string;
  image: string;
  uploadDateTime: string;
  uploaderIp: string;
}

const IMAGES = gql`
  query allImages {
    allImages {
      id
      title
      image
      uploaderIp
      uploadDateTime
    }
  }
`;


const UPDATE_IMAGE = gql`
  mutation updateImage($id: ID!, $title: String!){
  updateImage(id: $id, title: $title) {
    image {
      id
      title
    }
  }
}
`;

const DELETE_IMAGE = gql`
  mutation deleteImage($id: ID!) {
    deleteImage(id: $id) {
      deleted
    }
  }
`;

const domain = "http://127.0.0.1:8000";

function formLink(link?: string) {
  return domain + "/api/get-image/" + link;
}

interface RowType {
  index: number;
  title: string;
  link: string;
  upload_date: string;
  uploader_ip: string;
}

interface ImageTypeData {
  allImages: ImageType[];
}

function useOutsideAlerter(ref: any, callback: any) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function Row(props: { row: RowType, refetch: any }) {
  const { row } = props;
  const [editing, setEditing] = React.useState(0);
  const [text, setText] = React.useState(row.title);
  const [title, setTitle] = React.useState(row.title);
  const [updateImage, { data, loading, error }] = useMutation(UPDATE_IMAGE);
  const [deleteImage] = useMutation(DELETE_IMAGE);
  const icon_color = "#8f8f8f";
  const wrapperRef = React.useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const handleConfirm = () => {
    setTitle(text);
    updateImage({ variables: { id: row.index, title: text } });
    setEditing(0);
  };
  const handleDisconfirm = () => {
    console.log("Hey")
      setEditing(0);
    };
  const handleEdit = () => {
    setEditing(1);
  };
  const handleDeletion = async () => {
    const data = await deleteImage({ variables: { id: row.index } });
    console.log(data);
    props.refetch()
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>{row.index}</TableCell>
        <TableCell component="th" scope="row">
          {editing ? (
            <TextField
              onChange={handleChange}
              value={text}
              // onBlur={handleDisconfirm}
              id="margin-none"
              // defaultValue={row.title}
            />
          ) : (
            <Link to={"/test/images/preview/" + row.link} style={{ cursor: "pointer" }}>
              {title}
            </Link>
          )}
        </TableCell>
        <TableCell align="right">{row.upload_date}</TableCell>
        <TableCell align="right">{row.uploader_ip}</TableCell>
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
          <DeleteIcon onClick={handleDeletion} style={{ color: icon_color, cursor: "pointer" }} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function filteredDate(_date: string) {
  const split_by_t = _date.split("T");
  const date = split_by_t[1].split(".");
  return split_by_t[0] + " " + date[0];
}

export default function App() {
  const [droped, setDroped] = React.useState(0);

  const [_file, setFile] = React.useState<any>(null);
  const [_image, setImage] = React.useState<any>(null);
  const [_title, setTitle] = React.useState<any>("Unknown");
  const { loading, error, data, refetch } = useQuery<ImageTypeData>(IMAGES);

  const handleDrop = (file: File) => {
    console.log("File dropped: " + file.name);
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      setFile(file);
      setImage(binaryStr);
      setDroped(1);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    await createImage(_image, _file.name);
    refetch();
  };

  const location = useLocation();
  const basepath = "/test/images";
  const table_link = basepath + "/";
  const preview_link = basepath + "/preview";

  return (
    <Switch>
      <Route exact path={table_link}>
        <Box margin={"10%"} marginTop={"150px"}>

          <Typography variant="h3" component="h2" marginBottom={"20px"}>
            Image table
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Upload date</TableCell>
                  <TableCell align="right">Uploader's IP</TableCell>
                  <TableCell align="right">Operations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.allImages.map((info: ImageType, index) => (
                  <Row
                    refetch={refetch}
                    key={index}
                    row={{
                      title: info.title,
                      index: info.id,
                      link: info.image,
                      upload_date: filteredDate(info.uploadDateTime),
                      uploader_ip: info.uploaderIp,
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box marginTop={"30px"} width={"100%"} marginX={"auto"}>
            <ChooseFile onDrop={handleDrop} />

            <Box
              width={"100px"}
              justifySelf="center"
              display="flex"
              flexDirection="column"
              alignContent="center"
              marginX={"auto"}
            >
              {droped ? (
                <Button
                  variant="contained"
                  type="button"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Route>
      <Route path={preview_link}>
        <ImagePreview />
      </Route>
    </Switch>
  );
}
