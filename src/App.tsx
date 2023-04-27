import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Modal,
  Snackbar,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [images, setImages] = useState<
    {
      url: string;
    }[]
  >([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const openSnackBar = () => {
    setSnackBarOpen(true);
  };

  const closeSnackBar = () => {
    setSnackBarOpen(false);
  };

  const onUploadImage = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();

    formData.append('file', image);
    setSelectedImage(image);
    setModal(true);

    //reset file input
    e.target.value = null;

    try {
      const options = {
        method: 'POST',
        body: formData,
      };
      // upload image to BE
      await fetch('http://localhost:8000/upload-image', options);
      // const data = await res.json();
      // console.log('🚀 - BEN | file: App.tsx:53 | onUploadImage | data:', data);
    } catch (error) {
      console.warn(error);
    }
  };

  const generateVariations = async () => {
    //safety check
    setImages([]);
    if (!selectedImage) {
      setModal(false);
      return;
    }

    try {
      const options = {
        method: 'POST',
      };
      const res = await fetch('http://localhost:8000/variations', options);
      const data = await res.json();
      console.log(
        '🚀 - BEN | file: App.tsx:63 | generateVariations | data:',
        data
      );
      setImages(data);
      setModal(false);
    } catch (error) {
      console.warn(error);
    }
  };

  const onPrompt = async () => {
    if (!prompt) {
      openSnackBar();
      return;
    }

    setLoading(true);
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await fetch('http://localhost:8000/generate-image', options);
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: grey[900],
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Modal
        open={modal && selectedImage}
        onClose={() => setSelectedImage(null)}
        aria-labelledby='modal-selected-image'
      >
        <>
          {modal && selectedImage && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '40rem',
                bgcolor: grey[900],
                p: 4,
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Alert variant='filled' severity='info'>
                Image must be 256x256 in size!
              </Alert>

              <Box
                component={'img'}
                src={URL.createObjectURL(selectedImage)}
                alt='selected-image'
                loading='lazy'
                sx={{ width: '15rem', height: '15rem', mt: 4 }}
              />
              <Button
                sx={{
                  mt: 4,
                  width: '15rem',
                }}
                color='primary'
                variant='contained'
                onClick={generateVariations}
              >
                generate
              </Button>
              <Button
                sx={{
                  mt: 1,
                  width: '15rem',
                }}
                color='secondary'
                variant='contained'
                onClick={() => {
                  setSelectedImage(null);
                  setModal(false);
                }}
              >
                upload new image
              </Button>
            </Box>
          )}
        </>
      </Modal>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert variant='filled' severity='warning'>
          Please enter an image description
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '3rem',
        }}
      >
        <TextField
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          variant='outlined'
          placeholder='Describe your image and I will draw it out!'
          sx={{
            background: grey[800],
            borderRadius: 2,
            width: '30rem',
            mr: 1,

            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: (theme) => theme.palette.primary.main,
              },
            },

            input: {
              color: 'white',
            },
          }}
        />
        <Button
          sx={{
            height: '100%',
          }}
          variant='contained'
          onClick={onPrompt}
        >
          generate
        </Button>
      </Box>

      {loading && (
        <CircularProgress
          sx={{
            my: 8,
          }}
        />
      )}

      {images.length !== 0 && (
        <Grid
          sx={{ mt: 4, width: '40rem' }}
          container
          spacing={2}
          justifyContent='center'
        >
          {images.map((image) => (
            <Grid
              item
              key={image.url}
              component={'img'}
              src={`${image.url}`}
              alt={image.url}
              loading='lazy'
              sx={{ width: '15rem', height: '15rem' }}
            />
          ))}
        </Grid>
      )}

      <Box
        sx={{
          mt: 2,
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            cursor: 'pointer',
          }}
        >
          <label htmlFor='files'>Or, upload an image to edit</label>
          <input
            onChange={onUploadImage}
            id='files'
            accept='images/*'
            type='file'
            hidden
          />
        </span>
      </Box>
    </Box>
  );
}

export default App;
