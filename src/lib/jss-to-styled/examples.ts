export const EXAMPLE_1 = {
  jss: `const useStyles = makeStyles((theme) => ({
  stepper: {
    marginLeft: theme.spacing(5),
    paddingRight: theme.spacing(3),
    marginRight: "auto",
    minWidth: 400
  },
  container: {
    marginTop: theme.spacing(4)
  },
  checkout: {
    marginTop: theme.spacing(3)
  },
  taxes: {
    color: theme.palette.text.primary,
    marginTop: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(3, 0)
  }
}));  
  `,
  jsx: `<React.Fragment>
  <AppBar>
    <Stepper
      className={classes.stepper}
      steps={["View cart", "Checkout", "Confirmation"]}
      activeIndex={0}
    />
  </AppBar>
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
                disabled={cartEntries.length === 0}
              >
                {"Proceed to checkout"}
              </Button>
              <Typography
                display="block"
                variant="caption"
                className={classes.taxes}
                align="center"
              >
                {"Taxes may apply before placing an order."}
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
              {"Your cart is empty, return to "}
              <Link to="/">the home page</Link>.
            </Typography>
          </Paper>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography variant="h4" gutterBottom>
            {"Your cart"}
            {" ("}
            {cartEntries.length}
            {")"}
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
                      {"Remove"}
                    </MuiLink>
                  }
                />
              )),
              <Divider className={classes.divider} />
            )}
          </Paper>
        </React.Fragment>
      )}
    </OrderBody>
  </Container>
  <AppFooter />
</React.Fragment>;
  `,
};

export const EXAMPLE_2 = {
  jss: `const styles = (theme) => ({
  root: {
    display: 'flex',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 18,
    lineHight: 1.5,
    alignItems: 'center',
  },
  svg: {
    width: 20,
    height: 25, // Needed for Safari
    marginRight: 12,
  },
});
  `,
  jsx: `<Component className={classes.root} {...other}>
  <img className={classes.svg} src={svg} alt="logo" /> Company
</Component>
  `,
};
