import * as Yup from 'yup';

export const validationSchema = Yup.object({
    startDate: Yup.date().required('Required'),
    endDate: Yup.date().required('Required').min(Yup.ref('startDate'), 'End date must be after start date'),
    guestCount: Yup.number().min(1).max(10).required('Required'),
    specialRequests: Yup.string(),
});