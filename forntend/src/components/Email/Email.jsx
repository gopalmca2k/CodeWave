import { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { BE_URL } from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const setVal = (e) => {
        setEmail(e.target.value);
        if (e.target.value) {
            setMessage('');
            setMessageClass('');
        }
    };

    const sendLink = (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Email address cannot be empty.');
            setMessageClass('show');
            return;
        }

        // Immediately show the processing message and disable the button
        setMessage('Mail sending in process...');
        setIsProcessing(true);
        setMessageClass('show');
        setButtonDisabled(true);

        // Use a setTimeout with 0ms to let the browser update the UI before making the API call
        setTimeout(async () => {
            let mailUrl = BE_URL + "/mail";
            try {
                const response = await axios.post(mailUrl, { email }, { withCredentials: true });

                if (response.data.status === 201) {
                    setEmail("");
                    setTimeout(() => {
                        setMessage('Password reset link sent successfully to your email.');
                        setMessageClass('show');
                    }, 1000);

                    setTimeout(() => {
                        setMessageClass('hide');
                    }, 5000);
                } else {
                    setMessage(response.data.message || 'An error occurred.');
                    setMessageClass('show');
                }
            } catch (error) {
                console.error("Error:", error);
                setMessageClass('show');
                setError('Invalid E-Mail or User not Found.');
            } finally {
                setTimeout(() => {
                    setIsProcessing(false);
                    setButtonDisabled(false);
                    setError('');
                }, 3000);
            }
        }, 0);
    };

    useEffect(() => {
        if (messageClass === 'hide') {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageClass('');
                setButtonDisabled(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [messageClass]);

    return (
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Container className="justify-content-end align-items-center shadow p-4 mb-5 bg-white rounded" style={{ width: '50%' }}>
                <Row className="justify-content-center align-items-center">
                    <Col>
                        <Form>
                            <Row className="justify-content-center">
                                <Col xs={12} className="text-center mb-3">
                                    <div className="form_heading">
                                        <h2>Reset Password</h2>
                                    </div>
                                </Col>
                            </Row>
                            <Form.Group controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={error || email}
                                    onChange={setVal}
                                    placeholder={isProcessing ? 'Mail Sending in process...' : (message || 'Enter Your Email Address')}
                                    disabled={buttonDisabled}
                                    isInvalid={!!message && message.includes('cannot be empty')}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button
                                className={btn mt-3 ${buttonDisabled ? 'button-disabled' : 'button-enabled'}}
                                onClick={sendLink}
                                style={{ backgroundColor: '#0055CC' }}
                            >
                                Send Password Reset Link
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default ForgotPassword;