import { HttpModuleOptions } from '@nestjs/axios';
import { AXIOS_TIMEOUT } from 'libs/shared/constants/axios.constants';

export const config: HttpModuleOptions = {
  timeout: AXIOS_TIMEOUT,
};
