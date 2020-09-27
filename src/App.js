import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const App = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('Your results will be shown here');
    const [submit, setSubmit] = useState(false);
    const [status, setStatus] = useState('');
    const [resColor, setResColor] = useState('grey'); // 0 = black, 1 = red, 2 = green

    const [links, setLinks] = useState([]);
    const [positives, setPositives] = useState([]);
    const [comments, setComments] = useState([]);

    let loadingGif = document.getElementById('loadingGif');

    const firstUpdate = useRef(true);
    useEffect(() => {
        setLinks([]);
        setPositives([]);
        setComments([]);
        const postData = () => {
            axios
                .post('http://localhost:8000/api/', {
                    user: query,
                })
                .then((response) => {
                    console.log(response.data);

                    if (response.data.status === 'error') {
                        setResult(
                            'A user with this username could not be found.'
                        );
                        setResColor('red');
                        setStatus(
                            "User not found. This user's may be banned, removed or NSFW."
                        );
                        loadingGif.removeAttribute('src');
                        return;
                    } else {
                        let sum = 0;
                        let indexes = [];

                        for (
                            let i = 0;
                            i < response.data.predictions.length;
                            i++
                        ) {
                            sum = sum + response.data.predictions[i];
                            if (response.data.predictions[i] === 1) {
                                indexes.push(i);
                            }
                        }

                        setStatus('Done!');
                        setLinks(response.data.links);
                        setComments(response.data.comments);
                        setPositives(indexes);

                        loadingGif.removeAttribute('src');
                        setResult(
                            sum >= 1
                                ? 'I think this user has toxic comments'
                                : "I don't think this user has toxic comments"
                        );
                        setResColor(() => {
                            if (sum >= 1) {
                                return 'red';
                            } else {
                                return 'green';
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        postData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submit]);

    const handleChange = (e) => {
        // console.log(`query: ${query}`);
        setQuery(e.target.value);
    };

    const handleSubmit = () => {
        if (query === '') {
            return;
        }

        setSubmit(!submit);

        loadingGif.src =
            'https://raw.githubusercontent.com/k4u5h4L/OffThePan/master/public/img/gifs/loading-model.gif';

        setStatus('Loading...');
        setResult('Your results will be shown here');
        setResColor('grey');
    };

    return (
        <div
            className="container-contact100"
            style={{ backgroundImage: "url('images/bg-01.jpg')" }}
        >
            <div className="wrap-contact100">
                <form className="contact100-form validate-form">
                    <span className="contact100-form-title">
                        Input a reddit username to determine whether he/she has
                        posted toxic comments or not!
                    </span>

                    <div
                        className="wrap-input100 validate-input"
                        data-validate="Message is required"
                    >
                        <span className="label-input100">Reddit username</span>
                        <input
                            className="input100"
                            name="headline"
                            placeholder="Enter Username Here..."
                            value={query}
                            onChange={(event) => handleChange(event)}
                        />
                    </div>

                    <div className="wrap-input100">
                        <span className="label-input100">Result</span>
                        <input
                            style={{
                                color: resColor,
                            }}
                            className="input100"
                            type="text"
                            name="web"
                            placeholder="Result"
                            readOnly={true}
                            value={result}
                        />
                        <span
                            className="contact100-more"
                            style={{ color: 'black' }}
                        >
                            {status}
                            <img id="loadingGif" width="195px" alt="" />
                        </span>
                    </div>

                    <div className="container-contact100-form-btn">
                        <div className="wrap-contact100-form-btn">
                            <div className="contact100-form-bgbtn"></div>
                            <button
                                type="button"
                                className="contact100-form-btn"
                                onClick={() => handleSubmit()}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    <div className="container-contact100-form-btn">
                        {resColor === 'green' ? (
                            <span
                                className="contact100-more"
                                style={{ color: 'black' }}
                            >
                                This user doesn't have any toxic comments!"
                            </span>
                        ) : (
                            <ul>
                                {positives.map((positive, index) => (
                                    <li key={index}>
                                        <span
                                            className="contact100-more"
                                            style={{ color: 'black' }}
                                        >
                                            <span>
                                                <em>Comment:</em>{' '}
                                                {comments[positive]}
                                            </span>
                                            <br />
                                            <span>
                                                <em>Post:</em>{' '}
                                                <a
                                                    className="input100"
                                                    style={{ color: 'black' }}
                                                    href={links[positive]}
                                                >
                                                    Click here
                                                </a>
                                            </span>
                                            <br />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </form>
            </div>

            <span className="contact100-more">
                Powered by React, Django, Selenium, BeautifulSoup and
                Tensorflow-Keras
            </span>
        </div>
    );
};

export default App;
