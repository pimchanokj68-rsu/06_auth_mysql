import "./style.css";

export const metadata = {
  title: "Auth Demo | Next.js & MySQL",
  description: "Authentication and protected member area with Next.js, MySQL, bcrypt, and JWT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
