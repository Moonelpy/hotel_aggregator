import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();

// этот декоратор устанавливает роли, с которыми можно ходить на роут
