#include <iostream>

using namespace std;

// class prg1
// {
//     int a, b;

// public:

//     void getData()
//     {
//         a = 10;
//         b = 20;
//     }
//     friend void sum(prg1 s)
//     {
//         int c = s.a + s.b;
//         cout << c;
//     }
// };

class prg2
{
    static int c;
    int d;

public:
    static void getData()
    {
        c++;
        //d=c;
        cout << c << endl;
    }
};
int prg2::c;
int main()
{
    // prg1 p;

    // p.getData();
    // sum(p);
    prg2::getData();

    return 0;
}