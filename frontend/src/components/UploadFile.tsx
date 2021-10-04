import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';

import {useDropzone} from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box' as any
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const DropZone = styled.div`
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
border-width: 2px;
border-radius: 2px;
border-color: #eeeeee;
border-style: dashed;
background-color: #fafafa;
color: #bdbdbd;
outline: none;
transition: border .24s ease-in-out;
opacity: 1.0;
`

const Container =styled.section`
display: flex;
flex-direction: column;
// width: 700px;
// justify-self: center;
// margin-right: auto;
// margin-left: auto;
`


export default function ChooseFile(props: { onDrop: any }) {
    const [files, setFiles] = useState<any>([]);
    const { getRootProps, open, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            // @ts-ignore
            setFiles(
                acceptedFiles.map((file: any) =>
                    Object.assign(file, {
                        // @ts-ignore
                        preview: URL.createObjectURL(file) as any,
                    })
                )
            );
            acceptedFiles.forEach((file: File) => {
                props.onDrop(file);
            });
        },
    });

    const thumbs = files.map((file: File & {preview: any}) => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img src={file.preview} style={img} />
            </div>
        </div>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            // @ts-ignore
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <Container>
            <DropZone {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <Button variant="outlined" type="button" onClick={open}>
                    Open File Dialog
                </Button>
            </DropZone>
            {/*@ts-ignore*/}
            <aside style={thumbsContainer}>{thumbs}</aside>
        </Container>
    );
}
