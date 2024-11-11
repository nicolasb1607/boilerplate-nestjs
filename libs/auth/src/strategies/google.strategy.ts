import { Role } from '@app/auth/enums/role.enum';
import { UserRepository } from '@app/database';
import { people_v1 } from '@googleapis/people';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { normalizeEmail } from 'libs/shared/functions/shared.functions';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
        private readonly oauth2Client;

        constructor(
                private configService: ConfigService,
                private readonly userRepository: UserRepository,
        ) {
                super({
                        clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
                        clientSecret: configService.get<string>(
                                'GOOGLE_CLIENT_SECRET',
                        ),
                        callbackURL: configService.get<string>(
                                'GOOGLE_CALLBACK_URL',
                        ),
                        scope: [
                                'email',
                                'profile',
                                'https://www.googleapis.com/auth/user.birthday.read',
                        ],
                });

                this.oauth2Client = new OAuth2Client(
                        configService.get<string>('GOOGLE_CLIENT_ID'),
                        configService.get<string>('GOOGLE_CLIENT_SECRET'),
                );
        }

        async validate(
                accessToken: string,
                refreshToken: string,
                profile: any,
        ) {
                const { name, emails, photos } = profile;

                this.oauth2Client.setCredentials({ access_token: accessToken });

                const peopleService = new people_v1.People({
                        auth: this.oauth2Client,
                });

                const person = await peopleService.people.get({
                        resourceName: 'people/me',
                        personFields: 'birthdays',
                });
                const birthday = person.data.birthdays?.[0]?.date || null;

                const dateOfBirth = birthday
                        ? new Date(
                                  birthday.year,
                                  birthday.month - 1,
                                  birthday.day,
                          )
                        : null;

                const normalizedEmail = normalizeEmail(emails[0].value);
                const user = await this.userRepository.findOrInsert(
                        { email: normalizedEmail },
                        {
                                email: normalizedEmail,
                                firstName: name.givenName,
                                lastName: name.familyName,
                                dateOfBirth,
                                profilePictureUrl: photos[0].value || null,
                                role: Role.User,
                        },
                );
                return user;
        }
}
