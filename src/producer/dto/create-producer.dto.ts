export class CreateProducerDto {
    name: string;
    movies: MovieDto[];
}

export class MovieDto {
    year: number;
    title: string;
    winner: boolean;
}