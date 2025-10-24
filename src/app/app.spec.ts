import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { UserSessionService, BannerContentService } from '@poc-mfe/shared';
import { Router, NavigationEnd } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let routerEventsSubject: Subject<any>;
  
  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

  const mockUserSessionService = {
    user: signal(mockUser),
    isLoggedIn: signal(0),
    isLoggedOut: signal(0)
  };

  const mockBannerContentService = {
    setBanner: vi.fn(),
    content: signal({ type: 'text', content: '' })
  };

  let mockRouter: any;

  beforeEach(async () => {
    routerEventsSubject = new Subject();
    
    mockRouter = {
      url: '/',
      navigateByUrl: vi.fn().mockResolvedValue(true),
      events: routerEventsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [App],
      providers: [
        { provide: UserSessionService, useValue: mockUserSessionService },
        { provide: BannerContentService, useValue: mockBannerContentService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    
    vi.clearAllMocks();
    mockUserSessionService.isLoggedIn.set(0);
    mockUserSessionService.isLoggedOut.set(0);
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer el banner inicial en ngOnInit', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    
    expect(mockBannerContentService.setBanner).toHaveBeenCalledWith({
      type: 'text',
      content: 'Bienvenido'
    });
  });

  it('debería establecer la ruta actual en ngOnInit', () => {
    mockRouter.url = '/home';
    
    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.currentRoute()).toBe('/home');
  });

  it('NO debería navegar cuando isLoggedOut sea 0', async () => {
    fixture.detectChanges();
    
    vi.clearAllMocks();
    
    // isLoggedOut ya está en 0 por defecto
    mockUserSessionService.isLoggedOut.set(0);
    
    await fixture.whenStable();
    
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('debería actualizar currentRoute cuando cambie la navegación', () => {
    fixture.detectChanges();

    // Simular navegación
    const navigationEvent = new NavigationEnd(1, '/about', '/about');
    routerEventsSubject.next(navigationEvent);

    expect(component.currentRoute()).toBe('/about');
  });

  it('debería actualizar currentRoute con urlAfterRedirects', () => {
    fixture.detectChanges();

    // Simular navegación con redirección
    const navigationEvent = new NavigationEnd(2, '/dashboard', '/dashboard/overview');
    routerEventsSubject.next(navigationEvent);

    expect(component.currentRoute()).toBe('/dashboard/overview');
  });

  it('debería retornar el usuario desde UserSessionService', () => {
    fixture.detectChanges();

    expect(component.user).toEqual(mockUser);
  });

  it('debería ignorar eventos del router que no sean NavigationEnd', () => {
    fixture.detectChanges();

    const initialRoute = component.currentRoute();

    // Emitir un evento que no es NavigationEnd
    routerEventsSubject.next({ id: 1, url: '/fake' });

    // La ruta no debería cambiar
    expect(component.currentRoute()).toBe(initialRoute);
  });

  it('debería actualizar el usuario cuando cambie en el servicio', () => {
    fixture.detectChanges();

    // Usuario inicial
    expect(component.user).toEqual(mockUser);

    // Cambiar usuario
    const newUser = { id: 2, name: 'New User', email: 'new@example.com' };
    mockUserSessionService.user.set(newUser);

    // Verificar cambio
    expect(component.user).toEqual(newUser);
  });

  it('debería suscribirse a los eventos del router correctamente', () => {
    fixture.detectChanges();

    // Verificar que la suscripción está activa emitiendo un evento
    const navigationEvent = new NavigationEnd(1, '/test', '/test');
    routerEventsSubject.next(navigationEvent);

    expect(component.currentRoute()).toBe('/test');
  });
});