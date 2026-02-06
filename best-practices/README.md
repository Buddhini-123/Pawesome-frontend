# Pawsome Frontend Best Practices

This directory contains established patterns and standards for the Pawsome frontend project, extracted from successful implementations and refined through experience.

## Quick Navigation

### Architecture Patterns
- **[Service Layer Architecture](./architecture/service-layer-architecture.md)** - Centralized API service with type-safe methods and consistent error handling

### Development Practices
- **[React API Integration](./development/react-api-integration.md)** - Clean React components with loading states, error handling, and user feedback

### Quality & Testing
- **[Frontend API Testing](./quality/frontend-api-testing.md)** - Comprehensive testing strategies with service mocking and integration tests

## Top 3 Best Practices for Loyalty API Integration

### 1. Service Layer Architecture
**Why it matters:** Separates API concerns from UI logic, making the codebase more maintainable and testable.

**Key Pattern:**
```typescript
// Base API service handles all HTTP communication
class ApiService {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>>
}

// Domain services use the base API service
class LoyaltyService {
  async getLoyaltyBalance(): Promise<LoyaltyBalance>
}

// Components use services, never fetch directly
const { data: balance } = useApi(() => loyaltyService.getLoyaltyBalance())
```

**File Location:** `/src/services/`

**Key Files:**
- `api.ts` - Base HTTP service
- `loyalty.service.ts` - Loyalty-specific operations

---

### 2. React API Integration with Error Handling & Loading States
**Why it matters:** Users experience proper feedback during async operations, improving perceived performance and trust.

**Key Pattern:**
```typescript
// Custom hook handles loading/error/data states
const { data, loading, error } = useApi<LoyaltyBalance>(
  () => loyaltyService.getLoyaltyBalance(),
  []
)

// Component renders appropriate UI for each state
if (loading) return <LoadingSkeleton /> // Show skeleton during fetch
if (error) return <ErrorAlert /> // Show error message if fetch fails
return <LoyaltyDisplay /> // Show data on success
```

**File Location:** `/src/components/` and `/src/hooks/`

**Key Components:**
- `LoadingSkeleton` - Animated placeholder during loading
- `ErrorAlert` - User-friendly error display with retry
- `useApi` hook - Reusable API state management

---

### 3. Frontend API Testing Strategies
**Why it matters:** Comprehensive tests prevent regressions and enable confident refactoring.

**Key Pattern:**
```typescript
// Unit test services with mocked API
jest.mock('../api')
describe('LoyaltyService', () => {
  it('should return balance on success', async () => {
    api.request.mockResolvedValueOnce({ success: true, data: mockBalance })
    const result = await loyaltyService.getLoyaltyBalance()
    expect(result).toEqual(mockBalance)
  })
})

// Integration test components with mocked services
jest.mock('../../services/loyalty.service')
describe('LoyaltyDashboard', () => {
  it('should display balance when loaded', async () => {
    loyaltyService.getLoyaltyBalance.mockResolvedValueOnce(mockBalance)
    render(<LoyaltyDashboard />)
    expect(await screen.findByText('100 Points')).toBeInTheDocument()
  })
})
```

**File Location:** `/__tests__/` directories alongside implementation files

**Test Coverage:**
- Service unit tests (API mocking)
- Component integration tests (service mocking)
- Error scenario tests
- Loading state tests

---

## Implementation Checklist for Loyalty API Integration

When adding new API endpoints to the loyalty system:

### Service Layer Setup
- [ ] Create new method in `loyalty.service.ts`
- [ ] Use `api.request<T>()` or convenience methods (`api.get()`, `api.post()`)
- [ ] Add proper error handling with try/catch
- [ ] Return typed response with `ApiResponse<T>` wrapper
- [ ] Add JSDoc comments with endpoint and auth requirements

### React Component Integration
- [ ] Create component using `useApi()` hook with service method
- [ ] Implement loading state (show `LoadingSkeleton`)
- [ ] Implement error state (show `ErrorAlert` with retry)
- [ ] Implement success state (show data)
- [ ] Add proper TypeScript types for all data

### Testing
- [ ] Write unit tests for service methods
- [ ] Write integration tests for components
- [ ] Test success, error, and loading paths
- [ ] Mock API responses using jest.mock()
- [ ] Verify proper error messages shown to users

---

## Common Patterns by Use Case

### Fetching Data on Component Mount
```typescript
// Hook automatically fetches when component mounts
const { data, loading, error } = useApi(
  () => loyaltyService.getLoyaltyBalance(),
  [] // Empty dependency = fetch once on mount
)
```

### User-Triggered Actions (Button Click)
```typescript
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const handleRedeem = async (points: number) => {
  setIsLoading(true)
  try {
    await loyaltyService.redeemPoints(cardId, points, orderId)
    // Show success
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}
```

### Pagination/Filtering
```typescript
const { data, loading, error } = useApi(
  () => loyaltyService.getPointsHistory(currentPage),
  [currentPage] // Refetch when page changes
)
```

---

## Type Definitions Reference

```typescript
// API Response wrapper - all requests return this
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Loyalty-specific types
interface LoyaltyBalance {
  balance: number
  expiring_soon: number
  expiry_date: string
}

interface PointTransaction {
  id: string
  type: 'earn' | 'redeem' | 'bonus' | 'donate'
  points: number
  description: string
  expires_at?: string
  created_at: string
}
```

---

## Debugging Tips

### API Call Not Hitting Endpoint
1. Check `localStorage.getItem('auth_token')` - is token present?
2. Verify endpoint URL in network tab (DevTools)
3. Check request headers - should have `Authorization: Bearer {token}`
4. Verify response status (200-299 for success)

### Loading State Stuck Forever
1. Check console for errors
2. Verify hook dependencies array `[]`
3. Ensure service method throws error on failure
4. Check if API response has `success: true`

### Error Not Displaying
1. Verify error state is being set: `setError(message)`
2. Check if error component is mounted in JSX
3. Ensure error message is truthy (not empty string)

---

## References

- [Loyalty API Guide](../LOYALTY_API_GUIDE.md) - Full API documentation
- [Backend Integration Summary](./docs/BACKEND-API-INTEGRATION-SUMMARY.md) - Implementation decisions
- [Session Management Test Report](./docs/SESSION-MANAGEMENT-TEST-REPORT.md) - Test coverage
