export default function ParallelLayout({
    children,
    team,
    analytics,
}:{
    children: React.ReactNode;
    team: React.ReactNode;
    analytics: React.ReactNode;
}) {
    return (
        <div>
            <h1>Parallel RoutesPage</h1>
            <div>{children}</div>
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{border: '1px solid red'}}>{team}</div>
                <div style={{border: '1px solid red'}}>{analytics}</div>
            </div>            
        </div>
    )
}