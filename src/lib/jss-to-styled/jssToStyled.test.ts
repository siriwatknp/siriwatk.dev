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
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
});`,
    });
  });

  it("support whole makeStyles function", () => {
    expect(
      jssToStyled({
        jss: `
          const useStyles = makeStyles({
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
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
});`,
    });
  });

  it("support makeStyles callback function with no theme", () => {
    expect(
      jssToStyled({
        jss: `
          const useStyles = makeStyles(() => ({
            iframe: {
              display: 'block',
              width: '100%',
              minHeight: 400,
              maxHeight: 'calc(100vh - 187px)',
            },
          }))
        `,
        jsx: `
        <div>
          <iframe className={classes.iframe} />
        </div>
        `,
      })
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')(() => ({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
}));`,
    });
  });

  it("support const declaration", () => {
    expect(
      jssToStyled({
        jss: `
          const styles = (theme) => ({
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
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')((
  {
    theme,
  },
) => ({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
}));`,
    });
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
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
});`,
    });
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
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')((
  {
    theme,
  },
) => ({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
}));`,
    });
  });

  it("transform function with props callback", () => {
    expect(
      jssToStyled({
        jss: `
          theme => ({
            iframe: ({ height }) => ({
              display: 'block',
              width: '100%',
              minHeight: height,
              maxHeight: 'calc(100vh - 187px)',
            }),
          })
        `,
        jsx: `
        <div>
          <iframe className={clsx('some-class', classes.iframe)} />
        </div>
        `,
      })
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')(({
  theme,
  height,
}) => ({
  display: 'block',
  width: '100%',
  minHeight: height,
  maxHeight: 'calc(100vh - 187px)',
}));`,
    });
  });

  it("transform function destructured object with props callback", () => {
    expect(
      jssToStyled({
        jss: `
          ({ palette, spacing }) => ({
            iframe: ({ height }) => ({
              display: 'block',
              width: '100%',
              minHeight: height,
              maxHeight: 'calc(100vh - 187px)',
            }),
          })
        `,
        jsx: `
        <div>
          <iframe className={clsx('some-class', classes.iframe)} />
        </div>
        `,
      })
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')(({
  palette,
  spacing,
  height,
}) => ({
  display: 'block',
  width: '100%',
  minHeight: height,
  maxHeight: 'calc(100vh - 187px)',
}));`,
    });
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
    ).toMatchObject({
      styledComponents: `const StyledIframe = styled('iframe')((
  {
    theme: { palette, spacing },
  },
) => ({
  display: 'block',
  width: '100%',
  backgroundColor: palette.primary.main,
  minHeight: spacing(50),
}));`,
    });
  });

  it("transform obj with CustomComponent", () => {
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
          <Cart className={classes.iframe} />
        </div>
        `,
      })
    ).toMatchObject({
      styledComponents: `const CartIframe = styled(Cart)({
  display: 'block',
  width: '100%',
  minHeight: 400,
  maxHeight: 'calc(100vh - 187px)',
});`,
    });
  });

  it("replace JSX with StyledComponent", () => {
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
    ).toMatchObject({
      jsx: `
        <div>
          <StyledIframe />
        </div>
        `,
    });
  });

  it("replace JSX with StyledComponent and only classes", () => {
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
          <iframe className={clsx('something', classes.iframe)} />
        </div>
        `,
      })
    ).toMatchObject({
      jsx: `
        <div>
          <StyledIframe className={clsx('something')} />
        </div>
        `,
    });
  });

  it("can transform styles.", () => {
    expect(
      jssToStyled({
        jss: `
          ({
            img: {
              display: 'block',
              width: '100%',
              minHeight: 400,
              maxHeight: 'calc(100vh - 187px)',
            },
          })
        `,
        jsx: `
        <div className={styles.img} />
        `,
      })
    ).toMatchObject({
      jsx: `
        <DivImg />
        `,
    });
  });

  describe("regression", () => {
    it("Case I", () => {
      expect(
        jssToStyled({
          jss: `
        (theme) => ({
          stepper: {
            marginLeft: theme.spacing(5),
            paddingRight: theme.spacing(3),
            marginRight: "auto",
            minWidth: 400,
          },
          container: {
            marginTop: theme.spacing(4),
          },
          checkout: {
            marginTop: theme.spacing(3),
          },
          taxes: {
            color: theme.palette.text.primary,
            marginTop: theme.spacing(2),
          },
          divider: {
            margin: theme.spacing(3, 0),
          },
        });
        `,
          jsx: `
          <React.Fragment>
            <Head title="View cart">
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <AppAppBar essential>
              <Stepper
                className={classes.stepper}
                steps={['View cart', 'Checkout', 'Confirmation']}
                activeIndex={0}
              />
            </AppAppBar>
            <Container className={classes.container} maxWidth="md">
              <OrderBody
                cart={cart}
                side={
                  <OrderSummary
                    cart={cart}
                    loading={!cart}
                    footer={
                      <React.Fragment>
                        <Button
                          variant="contained"
                          naked
                          component={Link}
                          to="/order-payment/"
                          fullWidth
                          className={classes.checkout}
                          disabled={cartEntries.length === 0}>
                          {'Proceed to checkout'}
                        </Button>
                        <Typography
                          display="block"
                          variant="caption"
                          className={classes.taxes}
                          align="center"
                        >
                          {'Taxes may apply before placing an order.'}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                }
              >
                {cartEntries.length === 0 ? (
                  <React.Fragment>
                    <Typography variant="h4" gutterBottom>
                      Your Cart
                    </Typography>
                    <Paper variant="outlined" padding>
                      <Typography>
                        {'Your cart is empty, return to '}
                        <Link to="/">the home page</Link>.
                      </Typography>
                    </Paper>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Typography variant="h4" gutterBottom>
                      {'Your cart'}
                      {' ('}
                      {cartEntries.length}
                      {')'}
                    </Typography>
                    <Paper variant="outlined" padding>
                      {intersperse(
                        cartEntries.map((entry) => (
                          <OrderLicense
                            key={entry.slug}
                            entry={entry}
                            action={
                              <MuiLink
                                variant="body2"
                                component="button"
                                className={classes.remove}
                                onClick={handleClickRemove(entry)}
                              >
                                {'Remove'}
                              </MuiLink>
                            }
                          />
                        )),
                        <Divider className={classes.divider} />,
                      )}
                    </Paper>
                  </React.Fragment>
                )}
              </OrderBody>
            </Container>
            <AppFooter />
          </React.Fragment>
        `,
        })
      ).toMatchObject({
        styledComponents: `const StyledStepper = styled(Stepper)((
  {
    theme,
  },
) => ({
  marginLeft: theme.spacing(5),
  paddingRight: theme.spacing(3),
  marginRight: "auto",
  minWidth: 400,
}));

const StyledContainer = styled(Container)((
  {
    theme,
  },
) => ({
  marginTop: theme.spacing(4),
}));

const ButtonCheckout = styled(Button)((
  {
    theme,
  },
) => ({
  marginTop: theme.spacing(3),
}));

const TypographyTaxes = styled(Typography)((
  {
    theme,
  },
) => ({
  color: theme.palette.text.primary,
  marginTop: theme.spacing(2),
}));

const StyledDivider = styled(Divider)((
  {
    theme,
  },
) => ({
  margin: theme.spacing(3, 0),
}));`,
        jsx: `
          <React.Fragment>
            <Head title="View cart">
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <AppAppBar essential>
              <StyledStepper steps={['View cart', 'Checkout', 'Confirmation']} activeIndex={0} />
            </AppAppBar>
            <StyledContainer maxWidth="md">
              <OrderBody
                cart={cart}
                side={
                  <OrderSummary
                    cart={cart}
                    loading={!cart}
                    footer={
                      <React.Fragment>
                        <ButtonCheckout
                          variant="contained"
                          naked
                          component={Link}
                          to="/order-payment/"
                          fullWidth
                          disabled={cartEntries.length === 0}>
                          {'Proceed to checkout'}
                        </ButtonCheckout>
                        <TypographyTaxes display="block" variant="caption" align="center">
                          {'Taxes may apply before placing an order.'}
                        </TypographyTaxes>
                      </React.Fragment>
                    }
                  />
                }
              >
                {cartEntries.length === 0 ? (
                  <React.Fragment>
                    <Typography variant="h4" gutterBottom>
                      Your Cart
                    </Typography>
                    <Paper variant="outlined" padding>
                      <Typography>
                        {'Your cart is empty, return to '}
                        <Link to="/">the home page</Link>.
                      </Typography>
                    </Paper>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Typography variant="h4" gutterBottom>
                      {'Your cart'}
                      {' ('}
                      {cartEntries.length}
                      {')'}
                    </Typography>
                    <Paper variant="outlined" padding>
                      {intersperse(
                        cartEntries.map((entry) => (
                          <OrderLicense
                            key={entry.slug}
                            entry={entry}
                            action={
                              <MuiLink
                                variant="body2"
                                component="button"
                                className={classes.remove}
                                onClick={handleClickRemove(entry)}
                              >
                                {'Remove'}
                              </MuiLink>
                            }
                          />
                        )),
                        <StyledDivider />,
                      )}
                    </Paper>
                  </React.Fragment>
                )}
              </OrderBody>
            </StyledContainer>
            <AppFooter />
          </React.Fragment>
        `,
        // MuiLink does not transform because there is no `classes.remove` in makeStyles
      });
    });

    it("Case II", () => {
      expect(
        jssToStyled({
          jss: `const useStyles = makeStyles(() => ({
            card: {
              position: "relative",
              borderRadius: theme.shape.borderRadius,
              padding: 12,
              backgroundColor: "#e5fcfb",
              minWidth: 300
            },
            learnMore: {
              backgroundColor: "#fff !important",
              color: "#fb703c",
              boxShadow: "0 2px 6px #d0efef",
              borderRadius: 12,
              minWidth: 120,
              minHeight: 42,
              fontFamily: family,
              textTransform: "initial",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: 0
            },
            img: {
              position: "absolute",
              width: "40%",
              bottom: 0,
              right: 0,
              display: "block"
            },
            shell: {
              position: "absolute",
              bottom: 0,
              right: 0,
              transform: "translate(70%, 50%)",
              borderRadius: "50%",
              backgroundColor: "rgba(71, 167, 162, 0.12)",
              padding: "40%",
              "&:before": {
                position: "absolute",
                borderRadius: "50%",
                content: '""',
                display: "block",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: "-16%",
                backgroundColor: "rgba(71, 167, 162, 0.08)"
              }
            }
          }));
          `,
          jsx: `<Card className={styles.card}>
          <Column gap={2} mr={2}>
            <Info position={"middle"} useStyles={useOfferInfoStyles}>
              <InfoTitle>50 Days of Premium!</InfoTitle>
              <InfoSubtitle>Get it before 01.01.2020</InfoSubtitle>
            </Info>
            <Item mt={2}>
              <Button className={styles.learnMore}>Learn more</Button>
            </Item>
          </Column>
          <img
            className={styles.img}
            alt={""}
            src={
              "https://pathwaychurch.life/wp-content/uploads/2018/09/bow-transparent-background-1.png"
            }
          />
          <div className={styles.shell} />
        </Card>;
        `,
        })
      ).toMatchObject({
        styledComponents: `const StyledCard = styled(Card)(() => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  padding: 12,
  backgroundColor: "#e5fcfb",
  minWidth: 300,
}));

const ButtonLearnMore = styled(Button)(() => ({
  backgroundColor: "#fff !important",
  color: "#fb703c",
  boxShadow: "0 2px 6px #d0efef",
  borderRadius: 12,
  minWidth: 120,
  minHeight: 42,
  fontFamily: family,
  textTransform: "initial",
  fontSize: "0.875rem",
  fontWeight: 700,
  letterSpacing: 0,
}));

const StyledImg = styled('img')(() => ({
  position: "absolute",
  width: "40%",
  bottom: 0,
  right: 0,
  display: "block",
}));

const DivShell = styled('div')(() => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  transform: "translate(70%, 50%)",
  borderRadius: "50%",
  backgroundColor: "rgba(71, 167, 162, 0.12)",
  padding: "40%",

  "&:before": {
    position: "absolute",
    borderRadius: "50%",
    content: '""',
    display: "block",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: "-16%",
    backgroundColor: "rgba(71, 167, 162, 0.08)"
  },
}));`,
        jsx: `<StyledCard>
          <Column gap={2} mr={2}>
            <Info position={"middle"} useStyles={useOfferInfoStyles}>
              <InfoTitle>50 Days of Premium!</InfoTitle>
              <InfoSubtitle>Get it before 01.01.2020</InfoSubtitle>
            </Info>
            <Item mt={2}>
              <ButtonLearnMore>Learn more</ButtonLearnMore>
            </Item>
          </Column>
          <StyledImg
            alt={""}
            src={
              "https://pathwaychurch.life/wp-content/uploads/2018/09/bow-transparent-background-1.png"
            } />
          <DivShell />
        </StyledCard>;
        `,
      });
    });
  });
});
