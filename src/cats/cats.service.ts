import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breadRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    const bread = await this.breadRepository.findOneBy({
      name: createCatDto.breed,
    });

    if (!bread) {
      throw new BadRequestException('Breed not found');
    }

    return await this.catsRepository.save({
      ...createCatDto,
      breed: bread,
    });
  }

  async findAll() {
    return await this.catsRepository.find();
  }

  async findOne(id: number) {
    return await this.catsRepository.findOneBy({ id });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const bread = await this.breadRepository.findOneBy({
      name: updateCatDto.breed,
    });

    if (!bread) {
      throw new BadRequestException('Breed not found');
    }

    return await this.catsRepository.update(
      { id },
      { ...updateCatDto, breed: bread },
    );
  }

  async remove(id: number) {
    return await this.catsRepository.softDelete({ id });
  }
}
