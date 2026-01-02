// /src/app/admin/login/page.tsx
import LoginForm from "@/components/auth/LoginForm";
import { Box, Container } from "@mui/material";

export default function LoginPage() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </Box>
  );
}