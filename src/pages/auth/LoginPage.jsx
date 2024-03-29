import { Button, Card, Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import { useNavigate, useSubmit } from 'react-router-dom';

import { t, useT } from '../../i18n/translate';

import TextField from '../../components/text-field/TextField';

import { BsLock, BsPerson } from 'react-icons/bs';
import { redirect } from 'react-router-dom';
import { login } from '../../api/authApi';
import { getUserData } from '../../api/usersApi';
import { backendLanguages } from '../../i18n/locales';
import RouteNames from '../../router/RouteNames';
import { loadCommunities } from '../../services/communityService';
import store from '../../store';
import { auxActions } from '../../store/aux-store/auxStore';
import { intlActions } from '../../store/intl-store/intlStore';
import { commuActions } from '../../store/misc/commuStore';
import { userActions } from '../../store/user-store/userStore';
import notify from '../../utils/notify';

function validate(values) {
  const errors = {};

  // if (!values.password) {
  //   errors.password = t('ERROR.REQUIRED');
  // }

  return errors;
}

function LoginPage() {
  const submit = useSubmit();
  const navigate = useNavigate();

  const t = useT();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      submit(values, {
        method: 'post',
        action: '/login',
      });
    },
  });

  return (
    <Card style={{ minWidth: '300px' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">{t('LOGIN')}</Card.Title>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <h6>{t('USERNAME')}</h6>
          <TextField
            id="username"
            type="username"
            placeholder={t('EXAMPLE_USERNAME')}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            isInvalid={formik.touched.username && formik.errors.username}
            prepend={<BsPerson />}
            className="mb-0"
          />
          <Form.Group className="d-flex flex-column align-items-end">
            <Card.Link
              href="#"
              onClick={() => navigate(RouteNames.FORGOT_USERNAME)}
              style={{
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              {t('FORGOT_YOUR_USERNAME?')}
            </Card.Link>
          </Form.Group>
          <h6>{t('PASSWORD')}</h6>
          <TextField
            id="password"
            type="password"
            placeholder={t('EXAMPLE_PASSWORD')}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            isInvalid={formik.touched.password && formik.errors.password}
            prepend={<BsLock />}
            className="mb-0"
          />
          <Form.Group className="d-flex flex-column align-items-end">
            <Card.Link
              className="ms-0 mb-1"
              href="#"
              onClick={() => navigate(RouteNames.FORGOT_PASSWORD)}
              style={{ fontSize: '14px', textDecoration: 'none' }}
            >
              {t('FORGOT_YOUR_PASSWORD?')}
            </Card.Link>
          </Form.Group>
          <Form.Group className="d-flex justify-content-center">
            <Button
              style={{ borderRadius: '24px' }}
              className="my-3 w-100"
              variant="primary"
              type="submit"
            >
              {t('ENTER')}
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default LoginPage;

export async function action({ request }) {
  try {
    store.dispatch(auxActions.setLoading(true));

    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    const { accessToken } = (await login(body)).data;

    const response = await getUserData();

    store.dispatch(userActions.setUser(response.data));

    const intl =
      Object.keys(backendLanguages).find(
        (key) => backendLanguages[key] === response.data.language
      ) ?? 'en';

    store.dispatch(intlActions.setLocale(intl));

    const { username } = store.getState().user;

    const communities = await loadCommunities();

    store.dispatch(commuActions.setCommunities(communities));

    notify.success(t('NOTIFY.SUCCESS.LOGIN', { username }));

    return redirect(RouteNames.NOTES);
  } catch (e) {
    console.error(e);
    notify.error(t('NOTIFY.ERROR.WRONG_CREDENTIALS'));
    return null;
  } finally {
    store.dispatch(auxActions.setLoading(false));
  }
}
