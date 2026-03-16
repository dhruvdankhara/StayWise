import type { Request, Response } from 'express';

import { HotelSettingsModel } from '../../models/HotelSettings';
import { sendSuccess } from '../../utils/api';
import { asyncHandler } from '../../utils/asyncHandler';

const defaultSettings = {
  name: 'StayWise Grand Hotel',
  address: '21 Residency Avenue, Jaipur, Rajasthan',
  contactEmail: 'hello@staywise.com',
  contactPhone: '+91 98765 43210',
  invoiceFooter: 'Thank you for choosing StayWise.',
  currency: 'INR',
  checkInTime: '14:00',
  checkOutTime: '11:00'
};

export const getSettings = asyncHandler(async (_request: Request, response: Response) => {
  let settings = await HotelSettingsModel.findOne();

  if (!settings) {
    settings = await HotelSettingsModel.create(defaultSettings);
  }

  sendSuccess(response, settings, 'Settings fetched');
});

export const updateSettings = asyncHandler(async (request: Request, response: Response) => {
  const current = await HotelSettingsModel.findOne();
  const settings = current
    ? await HotelSettingsModel.findByIdAndUpdate(current._id, request.body, { new: true, runValidators: true })
    : await HotelSettingsModel.create({ ...defaultSettings, ...request.body });

  sendSuccess(response, settings, 'Settings updated');
});
