import app from './app';
import { PORT } from './utils/constants';
import logger from './utils/logger';

app.listen(PORT, () => {
    logger.debug(`Server listen to ${PORT}`);
});