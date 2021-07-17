import { jssToStyled } from "./jssToStyled";

describe("jssToStyled", () => {
  it("transform obj with html tag", () => {
    expect(
      jssToStyled({
        jss: `
          ({
            iframe: {
              display: 'block',
              width: '100%',
              minHeight: 400,
              maxHeight: 'calc(100vh - 187px)',
            },
          })
        `,
        jsx: `
        <div>
          <iframe className={classes.iframe} />
        </div>
        `,
      })
    ).toEqual(`const StyledIframe = styled('iframe')({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
});`);
  });

  it("transform obj with html tag + clsx", () => {
    expect(
      jssToStyled({
        jss: `
          ({
            iframe: {
              display: 'block',
              width: '100%',
              minHeight: 400,
              maxHeight: 'calc(100vh - 187px)',
            },
          })
        `,
        jsx: `
        <div>
          <iframe className={clsx('some-class', classes.iframe)} />
        </div>
        `,
      })
    ).toEqual(`const StyledIframe = styled('iframe')({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
});`);
  });

  it("transform function with html tag", () => {
    expect(
      jssToStyled({
        jss: `
          theme => ({
            iframe: {
              display: 'block',
              width: '100%',
              minHeight: 400,
              maxHeight: 'calc(100vh - 187px)',
            },
          })
        `,
        jsx: `
        <div>
          <iframe className={clsx('some-class', classes.iframe)} />
        </div>
        `,
      })
    ).toEqual(`const StyledIframe = styled('iframe')((
  {
    theme,
  },
) => ({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
}));`);
  });

  it("transform function destructured object with html tag", () => {
    expect(
      jssToStyled({
        jss: `
          ({ palette, spacing }) => ({
            iframe: {
              display: 'block',
              width: '100%',
              backgroundColor: palette.primary.main,
              minHeight: spacing(50),
            },
          })
        `,
        jsx: `
        <div>
          <iframe className={clsx('some-class', classes.iframe)} />
        </div>
        `,
      })
    ).toEqual(`const StyledIframe = styled('iframe')((
  {
    theme: { palette, spacing },
  },
) => ({
  display: 'block',
  width: '100%',
  backgroundColor: palette.primary.main,
  minHeight: spacing(50),
}));`);
  });
});
