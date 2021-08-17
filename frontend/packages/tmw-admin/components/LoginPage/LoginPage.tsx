import * as React from 'react';
import { AxiosError } from 'axios';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { APILoginErrors } from 'tmw-admin/constants/api-types';
import { login } from 'tmw-admin/utils/auth-module';
import logoIcon from 'tmw-common/images/logo-icon.svg';

export const LoginPage: React.FunctionComponent = () => {
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const hasError = errorMessage.length > 0;
    const isReadyToLogin = username.length > 0 && password.length > 0;

    const onFormSubmit = async (): Promise<void> => {
        await login({ username, password }).catch((error: AxiosError) => {
            if (error.response && error.response.data.error == APILoginErrors.BAD_CREDENTIALS) {
                setErrorMessage("Your username and password don't match !");
            } else {
                setErrorMessage('Unknown error');
            }
        });
    };

    const onUsernameInputChange = (_: any, { value }: { value: string }): void => {
        setUsername(value);
    };

    const onPasswordInputChange = (_: any, { value }: { value: string }): void => {
        setPassword(value);
    };

    return (
        <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Image size="tiny" centered src={logoIcon} />
                <Header as="h2" color="orange" textAlign="center">
                    TipsMyWeb Admin
                </Header>
                <Form size="large" error={hasError}>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="Username"
                            value={username}
                            onChange={onUsernameInputChange}
                        />
                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={onPasswordInputChange}
                        />
                        {hasError ? <Message error>{errorMessage}</Message> : null}
                        <Button
                            disabled={!isReadyToLogin}
                            color="orange"
                            fluid
                            size="large"
                            onClick={onFormSubmit}
                        >
                            Login
                        </Button>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    );
};
