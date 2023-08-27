const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/web/public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // вытаскивает CSS из JavaScript
                    'css-loader'  // превращает CSS в CommonJS модуль
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css' // имя выходного файла
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'src/web'),
            watch: true
        },
        hot: true,
        port: 8080
    },
    mode: 'development',
};