
export interface IService<DependenciesT = {}> {
    inject(services: DependenciesT): void
}