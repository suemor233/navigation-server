// import { Injectable } from '@nestjs/common';
// import { ReturnModelType } from '@typegoose/typegoose';
// import { SocketGateway } from '~/processors/gateway/ws.gateway';
// import { InjectModel } from '~/transformers/model.transformer';
// import { AboutModel } from './about.model';

// @Injectable()
// export class AboutService {
//   constructor(
//     @InjectModel(AboutModel)
//     private readonly aboutModel: ReturnModelType<typeof AboutModel>,
//     private readonly ws: SocketGateway,
//   ) { }

//   createAbout(about: AboutModel) {
//     return this.aboutModel.create(about);
//   }
// }
