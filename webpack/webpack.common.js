const path = require('path');
const webpack = require('webpack')
module.exports = {
   mode: "production",
   entry: {
      background: path.resolve(__dirname, "..", "src",   "background.ts"),
      contentscript: path.resolve(__dirname, "..", "src",   "contentscript.ts"),
      injectscript: path.resolve(__dirname, "..", "src",   "injectscript.ts"),
   },
   output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js", ".tsx"],
	   fallback: {
         "crypto": require.resolve("crypto-browserify"), 
         "stream": require.resolve("stream-browserify"), 
         "assert": require.resolve("assert"), 
         "http": require.resolve("stream-http"), 
         "https": require.resolve("https-browserify"), 
         "os": require.resolve("os-browserify"), 
         "url": require.resolve("url") ,
         "path": require.resolve("path-browserify/"),
         "zlib": require.resolve("browserify-zlib"),
         "constants": require.resolve("constants-browserify"),
         "fs": false,
         "child_process": false,
         "timers": require.resolve("timers-browserify"),
         "net":  false,
         "tls": false,
         "dns": false,
         "vm": require.resolve("vm-browserify"),
      
		},
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
         {
            exclude: /node_modules/,
            test: /\.scss$/,
            use: [
              {
                loader: "style-loader" // Creates style nodes from JS strings
              },
              {
                loader: "css-loader" // Translates CSS into CommonJS
              },
              {
                loader: "sass-loader" // Compiles Sass to CSS
              }
            ]
          }
      ],
   },
   plugins: [
      new webpack.ProvidePlugin({ 
         process: 'process/browser', 
        Buffer: ['buffer', 'Buffer'] 
      }),
      new webpack.DefinePlugin({ // <-- key to reducing React's size
         'process.env': {
           'NODE_ENV': JSON.stringify('production')
         }
       }),
   ]
};
