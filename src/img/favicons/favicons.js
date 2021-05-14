const faviconsContext = require.context(
    '!!file-loader?name=img/favicons/[name].[ext]!.',
    false,
    /\.(svg|png|ico|xml|json)$/
);

faviconsContext.keys().forEach(faviconsContext);
