import { Button, Card, Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import { redirect, useSubmit } from 'react-router-dom';

import { t, useT } from '../../i18n/translate';

import { BsAt, BsGlobe, BsLock, BsPerson } from 'react-icons/bs';
import { register } from '../../api/authApi';
import { postBoard } from '../../api/boardApi';
import TextField from '../../components/text-field/TextField';
import RouteNames from '../../router/RouteNames';
import store from '../../store';
import { auxActions } from '../../store/aux-store/auxStore';
import notify from '../../utils/notify';

function validate(values) {
  const errors = {};

  if (!values.username) {
    errors.username = t('ERROR.REQUIRED');
  } else if (values.username.length > 15) {
    errors.username = t('ERROR.MAXIMUM_X_CHARACTERS', { x: 15 });
  }

  if (!values.email) {
    errors.email = t('ERROR.REQUIRED');
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = t('ERROR.INVALID_EMAIL_ADDRESS');
  }

  if (values.nationality.length > 15) {
    errors.nationality = t('ERROR.MAXIMUM_X_CHARACTERS', { x: 15 });
  }

  if (!values.password) {
    errors.password = t('ERROR.REQUIRED');
  } else if (
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])/.test(
      values.password
    )
  ) {
    errors.password = t('ERROR.PASSWORD_REQUISITES');
  } else if (values.password.length < 8) {
    errors.password = t('ERROR.MINIMUM_X_CHARACTERS', { x: 8 });
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = t('ERROR.REQUIRED');
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = t('ERROR.PASSWORDS_DO_NOT_MATCH');
  }

  return errors;
}

function RegisterPage() {
  const submit = useSubmit();

  const t = useT();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      nationality: '',
      password: '',
      confirmPassword: '',
    },
    validate,
    onSubmit: (values) => {
      submit(values, {
        method: 'post',
        action: '/register',
      });
    },
  });

  return (
    <Card style={{ minWidth: '300px', maxWidth: '300px' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">{t('REGISTER')}</Card.Title>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <h6>{t('USERNAME')}</h6>
          <TextField
            id="username"
            type="username"
            intlKey="USERNAME"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            isInvalid={formik.touched.username && formik.errors.username}
            prepend={<BsPerson />}
            className="mb-3"
          />
          <h6>{t('EMAIL')}</h6>
          <TextField
            id="email"
            type="email"
            intlKey="EMAIL"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            isInvalid={formik.touched.email && formik.errors.email}
            prepend={<BsAt />}
            className="mb-3"
          />
          <h6>{t('NATIONALITY')}</h6>
          <TextField
            id="nationality"
            type="nationality"
            intlKey="NATIONALITY"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nationality}
            isInvalid={formik.touched.nationality && formik.errors.nationality}
            className="mb-3"
            prepend={<BsGlobe />}
          />
          <h6>{t('PASSWORD')}</h6>
          <TextField
            id="password"
            type="password"
            intlKey="PASSWORD"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            isInvalid={formik.touched.password && formik.errors.password}
            className="mb-3"
            prepend={<BsLock />}
          />
          <h6>{t('CONFIRM_PASSWORD')}</h6>
          <TextField
            id="confirmPassword"
            type="password"
            intlKey="CONFIRM_PASSWORD"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            isInvalid={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            prepend={<BsLock />}
          />
          <Form.Group className="d-flex justify-content-center">
            <Button
              className="mb-3 w-100"
              variant="primary"
              type="submit"
              style={{ borderRadius: '24px' }}
            >
              {t('REGISTER')}
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RegisterPage;

export async function action({ request }) {
  try {
    store.dispatch(auxActions.setLoading(true));

    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    await register(body);

    await postBoard({
      title: 'Default',
      color: 'white',
    });

    notify.success(t('NOTIFY.SUCCESS.REGISTER'));
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    store.dispatch(auxActions.setLoading(false));
    return redirect(RouteNames.LOGIN);
  }
}
