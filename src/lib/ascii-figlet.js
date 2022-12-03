import figlet from 'figlet';

const createAsciiFiglet = (title) => {
    return new Promise((resolve, reject) =>
        figlet.text(
            title,
            {
                font: 'JS Cursive',
                width: 100
            },
            (err, data) => {
                if (err) reject(err);
                else {
                    console.log('\n' + data);
                    resolve(null);
                }
            }
        )
    );
};

export default createAsciiFiglet;
