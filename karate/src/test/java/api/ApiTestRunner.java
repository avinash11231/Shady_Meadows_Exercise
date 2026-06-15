package api;

import com.intuit.karate.junit5.Karate;

class ApiTestRunner {

    @Karate.Test
    Karate testAll() {
        return Karate.run("classpath:features")
                .relativeTo(getClass());
    }
}