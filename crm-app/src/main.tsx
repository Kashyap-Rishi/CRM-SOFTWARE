import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AllLogDataProvider } from './hooks/AllLogContext'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AllCustomerDataProvider } from './hooks/AllCustomerContext';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
   
<GoogleOAuthProvider clientId="158478297408-gevob1skc53nfic5u33qd9nguctbmkq8.apps.googleusercontent.com">
  <AllCustomerDataProvider>
<AllLogDataProvider>
<ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
    </AllLogDataProvider>
    </AllCustomerDataProvider>
    </GoogleOAuthProvider>
)
