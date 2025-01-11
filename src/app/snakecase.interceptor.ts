import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import snakecaseKeys from 'snakecase-keys';

export const snakecaseInterceptor: HttpInterceptorFn = (req, next) => {
  try {

    if (req.body) {
      const snakeCaseBody = snakecaseKeys(req.body as Record<string, unknown>, { deep: true });
        const clonedRequest = req.clone({ body: snakeCaseBody });
        return next(clonedRequest);
    }
  } catch (error) {
    console.error('Error transforming body to snake_case:', error);
  }
  return next(req);
};
