const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = {
    // コンパイルモード
    mode: 'production',
    // エントリーポイントの設定
    entry: {
        // コンパイル対象のファイルを指定
        'index': path.resolve(__dirname, "./src/js/index.js"),
        'style.css': path.resolve(__dirname, './src/scss/style.scss')
    },
    // 出力設定
    output: {
        path: path.resolve(__dirname, './assets/'), // 出力先フォルダを絶対パスで指定
        filename: 'js/[name].js' // [name]にはentry:で指定したキーが入る
    },
    module: {
        rules: [
            // sassのコンパイル設定
            {
                test: /\.(sa|sc|c)ss$/, // 対象にするファイルを指定
                use: [
                    MiniCssExtractPlugin.loader, // JSとCSSを別々に出力する
                    {
                        loader: 'css-loader',
                        options: {
                            import: false,
                            url: false, //URL の解決を無効に
                        }
                    },
                    'postcss-loader', // オプションはpostcss.config.jsで指定
                    'sass-loader',
                    // 下から順にコンパイル処理が実行されるので、記入順序に注意
                ]
            },
            {
                // Babel 用のローダー
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(), // CSS別出力時の不要JSファイルを削除
        new MiniCssExtractPlugin({ // CSSの出力先
            filename: 'css/[name]'// 出力ファイル名を相対パスで指定（[name]にはentry:で指定したキーが入る）
        })
    ],
    // 開発用サーバーの設定 (オプション)
    devServer: {
        static: path.resolve(__dirname, './assets/'),
        compress: true,
        port: 8080,
        hot: true, 
    },
    // node_modules を監視（watch）対象から除外
    watchOptions: {
        ignored: /node_modules/
    }
};
