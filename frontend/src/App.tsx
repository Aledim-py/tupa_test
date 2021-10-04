import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import ChooseFile from "./components/UploadFile";
import { createImage, getImages } from "./api/requests";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData>, index: number }) {
  const { row, index } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {index}
        </TableCell>
        <TableCell component="th" scope="row">
          <Link underline="hover" style={{cursor: "pointer"}}>
            {row.name}
          </Link>
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

let _file: any = null;
let _image: any = null;
export default function App() {
  const [droped, setDroped] = React.useState(0);
  const [testImage, setTestImage] = React.useState("https://miro.medium.com/max/2000/1*cLQUX8jM2bMdwMcV2yXWYA.jpeg");

  const handleDrop = (file: File) => {
      console.log("File dropped: " + file.name)
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          _file = file;
          _image = binaryStr;
          setDroped(1);
      };
      reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
      createImage(_image, _file.name);
  };

  const handleDownload = async () => {
      const rec = await getImages();
      console.log(rec.image)
      // setTestImage(URL.createObjectURL(rec.image))
  };

  return (
      <Box margin={"10%"} marginTop={"150px"}>
      <img src={testImage} style={{width: 400, height: 300}}/>
          <Typography variant="h3" component="h2" marginBottom={"20px"}>
              Image table
          </Typography>
          <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                  <TableHead>
                      <TableRow>
                          <TableCell>Index</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell align="right">Upload date</TableCell>
                          <TableCell align="right">Uploader's IP</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {rows.map((row, index) => (
                          <Row index={index} key={row.name} row={row} />
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

          <Button variant="contained" type="button" onClick={handleDownload}>
              DownloadImage
          </Button>
      </Box>
  );
}
