
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = require('./app');

app.listen(app.get('port'), () =>{
    console.log('Servidor en puerto: ', app.get('port'));
    console.log('Entorno actual:', process.env.NODE_ENV);
});