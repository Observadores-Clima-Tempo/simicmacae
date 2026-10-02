import { z } from "zod";

const pwsMetricSchema = z.object({
  temp: z.number().nullish(),
  tempAvg: z.number().nullish(),
});

const pwsObservationSchema = z.object({
  metric: pwsMetricSchema.nullish(),
  humidity: z.number().nullish(),
  humidityAvg: z.number().nullish(),
  lat: z.number().nullish(),
  lon: z.number().nullish(),
  obsTimeLocal: z.string().nullish(),
});

export const pwsResponseSchema = z.object({
  observations: z.array(pwsObservationSchema).default([]),
});

export type PwsObservation = z.infer<typeof pwsObservationSchema>;
export type PwsResponse = z.infer<typeof pwsResponseSchema>;
