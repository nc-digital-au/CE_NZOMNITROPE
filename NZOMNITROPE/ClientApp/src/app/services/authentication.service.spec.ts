import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSession should call /.auth/me and map response to claims and current user', (done) => {
    const mockResponse = {
      name: 'John Doe',
      prescriber_id: 'P123',
      prescriber_number: 'PN456',
      ahpra_number: 'AH789'
    };

    service.getSession(true).subscribe(session => {
      expect(session).toBeTruthy();
      expect(session!.find(c => c.type === 'name')?.value).toBe('John Doe');

      const currentUser: any = service.currentUser;
      expect(currentUser).toBeDefined();
      expect(currentUser.prescriberId).toBe('P123');
      expect(currentUser.prescriberNumber).toBe('PN456');
      expect(currentUser.ahpraNumber).toBe('AH789');
      done();
    });

    const req = httpMock.expectOne('/.auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getSession should return ANONYMOUS when /.auth/me returns null', (done) => {
    service.getSession(true).subscribe(session => {
      expect(session).toBeNull();
      done();
    });

    const req = httpMock.expectOne('/.auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });
});
