// Converter horário "HH:MM" para minutos totais (ex: "16:20" => 980)
export const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(":").map(Number);
  return h! * 60 + m!;
};
