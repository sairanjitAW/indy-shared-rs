_Generating the C header:_

Install [cbindgen](https://github.com/eqrion/cbindgen/):

```sh
cargo install cbindgen
```

From the `indy-credx` directory, generate the header file:

```sh
cbindgen --config include/cbindgen.toml --crate indy-credx --output include/indy_credx.h
```
