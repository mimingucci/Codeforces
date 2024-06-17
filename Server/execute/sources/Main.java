import java.io.*;
import java.util.*;
import java.lang.*;
import java.math.*;

public class Main {
    static class InputReader {
        BufferedReader reader;
        StringTokenizer tokenizer;

        public InputReader(InputStream stream) {
            reader = new BufferedReader(new InputStreamReader(stream), 32768);
            tokenizer = null;
        }

        String next() { // reads in the next string
            while (tokenizer == null || !tokenizer.hasMoreTokens()) {
                try {
                    tokenizer = new StringTokenizer(reader.readLine());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            return tokenizer.nextToken();
        }

        public int nextInt() { // reads in the next int
            return Integer.parseInt(next());
        }

        public long nextLong() { // reads in the next long
            return Long.parseLong(next());
        }

        public double nextDouble() { // reads in the next double
            return Double.parseDouble(next());
        }
    }

    static InputReader r = new InputReader(System.in);
    static PrintWriter pw = new PrintWriter(System.out);


    public static int lower_bound(ArrayList<Integer> ar, int k) {
        int s = 0;
        int e = ar.size();
        while (s != e) {
            int mid = s + e >> 1;
            if (ar.get(mid) < k) {
                s = mid + 1;
            } else {
                e = mid;
            }
        }
        if (s == ar.size()) {
            return -1;
        }
        return s;
    }

    public static int upper_bound(ArrayList<Integer> ar, int k) {
        int s = 0;
        int e = ar.size();
        while (s != e) {
            int mid = s + e >> 1;
            if (ar.get(mid) <= k) {
                s = mid + 1;
            } else {
                e = mid;
            }
        }
        if (s == ar.size()) {
            return -1;
        }
        return s;
    }

    static int bit(long n, int i) {
        return (int) ((n >> i) & 1);
    }

    static boolean isPowerOfTwo(long n) {

        return (n >= 1) && (!((n & (n - 1)) >= 1));
    }

    static boolean isPrime(long n) {
        if (n <= 1) return false;
        if (n <= 3) return true;

        if (n % 2 == 0 || n % 3 == 0) return false;

        for (long i = 5; i * i <= n; i = i + 6)
            if (n % i == 0 || n % (i + 2) == 0)
                return false;

        return true;
    }

    public static class Pair<F, SC> implements Comparable {
        public F First;
        public SC Second;

        public Pair(F first, SC second) {
            First = first;
            Second = second;
        }

        public F getFirst() {
            return First;
        }

        public void setFirst(F first) {
            First = first;
        }

        public SC getSecond() {
            return Second;
        }

        public void setSecond(SC second) {
            Second = second;
        }

        @Override
        public int compareTo(Object o) {
            if ((int) this.getFirst() - (int) ((Pair) o).getFirst() != 0) {
                if ((int) this.getFirst() - (int) ((Pair) o).getFirst() > 0) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if ((int) this.getSecond() - (int) ((Pair) o).getSecond() > 0) {
                    return 1;
                } else {
                    if ((int) this.getSecond() - (int) ((Pair) o).getSecond() == 0) {
                        return 0;
                    } else {
                        return -1;
                    }
                }
            }
        }
    }

    public static boolean isPalindrome(String s) {
        if (s.length() == 1) {
            return true;
        } else {
            int n = s.length();
            for (int i = 0; i < n / 2; i++) {
                if (s.charAt(i) != s.charAt(n - 1 - i)) {
                    return false;
                }
            }
            return true;
        }
    }

    public static long gcd(long a, long b) {
        if (b == 0)
            return a;
        return gcd(b, a % b);
    }

    public static long lcm(long a, long b) {
        return (a / gcd(a, b)) * b;
    }

    static long sum(long from, long to) {
        if (from > to) {
            return 0l;
        }
        if (from == to) {
            return from;
        }
        if ((to - from + 1) % 2 == 0) {
            return (to + from) * ((to - from + 1) / 2);
        } else {
            return (to + from) * ((to - from + 1) / 2) + (to + from) / 2;
        }
    }

    private static final int MAXN = (int) 1e6;

    private static final long MOD = 998244353;
    private static long[] fac = new long[MAXN + 1];
    private static long[] inv = new long[MAXN + 1];

    private static long exp(long x, long n, long m) {
        x %= m;  // note: m * m must be less than 2^63 to avoid ll overflow
        long res = 1;
        while (n > 0) {
            if (n % 2 == 1) {
                res = res * x % m;
            }
            x = x * x % m;
            n /= 2;
        }
        return res;
    }

    private static void factorial(long p) {
        fac[0] = 1;
        for (int i = 1; i <= MAXN; i++) {
            fac[i] = fac[i - 1] * i % p;
        }
    }

    private static void inverses(long p) {
        inv[MAXN] = exp(fac[MAXN], p - 2, p);
        for (int i = MAXN; i >= 1; i--) {
            inv[i - 1] = inv[i] * i % p;
        }
    }

    private static long choose(long n, long r, long p) {
        return fac[(int) n] * inv[(int) r] % p * inv[(int) (n - r)] % p;
    }

    public static void solve() {
        int n = r.nextInt();
        String s = r.next();
        int ans = 1;
        int now = 0;
        for (int i = 2; i <= n; i++) {
            Vector<Integer> cnt = new Vector<>();
            for (int j = 0; j <= 5007; j++) cnt.add(0);
            now = 0;
            for (int j = 0; j < n; j++) {
                if ((s.charAt(j) == '0' && now % 2 == 1) || (s.charAt(j) == '1' && now % 2 == 0)) {
                    //
                } else {
                    int v = cnt.get(i - 1) + 1;
                    cnt.set(i - 1, v);
                    now++;
                }
                now -= cnt.get(0);
                cnt.remove(0);
                cnt.add(0);
            }
            if (now == 0) {
                ans = i;
            }
        }
        pw.println(ans);
    }

    public static void main(String[] args) {
        int t = r.nextInt();
        while ((t--) > 0) {
            solve();
        }
        pw.close(); // flushes the output once printing is done
    }
}