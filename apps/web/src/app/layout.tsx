import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                eruda.init({
                  defaults: {
                    displaySize: 30,
                    transparency: 0.95,
                    position: 'right'
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </body>
    </html>
  );
}
