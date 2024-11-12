import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;
          if (user) {
            return { id: user.uid, email: user.email };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error al iniciar sesión con Firebase:", error);
          throw new Error("Credenciales inválidas");
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // Tiempo de expiración de la sesión (24 horas)
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = token.user; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Almacena el usuario en el token si existe
      }
      return token;
    },
  },
  pages: {
    signIn: '/login', 
  },
  debug: process.env.NODE_ENV === 'development',
});
