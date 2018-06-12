import request from 'request';

export const getOptions = ({id = '', json = {}, route='/documents',  token, method = 'GET', port=9000}) => ({
    url: `http://127.0.0.1:${port}/api${route}/${id}`,
    headers: {
        'Authorization': `Bearer ${token}`,
    },
    json,
    method,
});

export const makeRequest = (args) => (
    new Promise((resolve, reject) =>
        request(getOptions(args), (err, res) => {
            if (err) reject(err);
            if(res.body.error) console.log(res.body.error);
            resolve(res);
        }),
    )
);
