type WeeklyCase = {
  begin_date: string;
  end_date: string;
  weekly_average_case: number[];
  all: number;
};
type PrefLatLon = { pref_name: string; lat: string; lon: string };
type PrefPopulation = { population: number[] };
type GovMeasure = {
  status: "kinkyu" | "manbou";
  begin_at: string;
  end_at: string;
  pref_id: number;
};
type Distance = {
  pref_name: string;
  distance: number[];
};
