import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    /**
     *  Check if user logged is same provider
     */
    if (provider_id === user_id)
      throw new Error("Provider doesn't create appointment for self");

    /**
     *  Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider)
      throw new Error('You can only create appointments with providers');

    const hourStart = startOfHour(parseISO(date));

    /**
     *  check for past dates
     */
    if (isBefore(hourStart, new Date())) {
      throw new Error('Past date are not permitted');
    }

    /**
     *  Checke data availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Appointment date is not available');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date: hourStart,
    });

    /**
     *  Notify appointment provider
     */

    const user = await User.findByPk(user_id);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );
    await Notification.create({
      content: `Novo Agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return appointment;
  }
}

export default new CreateAppointmentService();
