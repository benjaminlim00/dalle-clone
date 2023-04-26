import { Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import { useState } from 'react';

function App() {
  const [text, setText] = useState('');

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '3rem',
        }}
      >
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant='outlined'
          placeholder='Describe your image and I will draw it out!'
          sx={{
            background: grey[800],
            borderRadius: 2,
            width: '30rem',
            mr: 1,

            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderRadius: 2,
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
          // onClick={() => setCount((count) => count + 1)}
        >
          generate
        </Button>
      </Box>
    </Box>
  );
}

export default App;
