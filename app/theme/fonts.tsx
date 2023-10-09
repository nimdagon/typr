import { units } from './units';

const defaultValues = {
  height: 720,
  width: 360
}

const size = (punto: number) => units.height / (defaultValues.height / punto);

export default { size };
