import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import snakecaseKeys from 'snakecase-keys';
import { instanceToPlain } from 'class-transformer';

export const snakecaseInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    if (req.body && !(req.body instanceof FormData)) {
      const plainObj = instanceToPlain(req.body);
      const snakeCaseBody = snakecaseKeys(plainObj as Record<string, any>, { deep: true });
      const clonedRequest = req.clone({ body: snakeCaseBody });
      return next(clonedRequest);
    }
  } catch (error) {
    console.error('Error transforming body to snake_case:', error);
  }
  return next(req);
};
