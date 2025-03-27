import React from 'react';
import { reduxForm } from 'redux-form';
import {
	required,
	password,
	email,
	normalizeEmail,
} from 'components/Form/validations';
import { AuthForm } from 'components';
import STRINGS from 'config/localizedStrings';

export const FORM_NAME = 'LoginForm';

const Form = (props) => {
	const FormFields = {
		email: {
			type: 'email',
			validate: [required, email],
			fullWidth: true,
			normalize: normalizeEmail,
			label: STRINGS['FORM_FIELDS.EMAIL_LABEL'],
			placeholder: STRINGS['FORM_FIELDS.EMAIL_PLACEHOLDER'],
		},
		password: {
			type: 'password',
			validate: [required, password],
			fullWidth: true,
			label: STRINGS['FORM_FIELDS.PASSWORD_LABEL'],
			placeholder: STRINGS['FORM_FIELDS.PASSWORD_PLACEHOLDER'],
		}
	};

	return (
		<AuthForm
			{...props}
			formFields={FormFields}
			buttonLabel={STRINGS['LOGIN_TEXT']}
		/>
	);
};
export default reduxForm({
	form: FORM_NAME,
})(Form);
