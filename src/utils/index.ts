import { BadRequestError } from "./error";

export * from "./error";
export * from "./response";

export const parseSince = (data: string) => {
  if (!data || data == 'undefined') return null;

  const amt = data.slice(0, data.length - 1);
  const unit = data.slice(data.length - 1);

  if (isNaN(parseInt(amt)) || !isNaN(parseInt(unit)))
    throw new BadRequestError("Invalid date format");

  const units = {
    H: 1000 * 60 * 60,
    D: 1000 * 60 * 60 * 24,
    W: 1000 * 60 * 60 * 24 * 7,
    M: 1000 * 60 * 60 * 24 * 7 * 4,
    Y: 1000 * 60 * 60 * 24 * 365,
  } as { [x: string]: number };

  const sinceinmilli = parseInt(amt) * units[unit.toUpperCase()];

  return new Date(Date.now() - sinceinmilli);
};
